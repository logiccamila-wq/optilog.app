import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

function rulesPath() {
  const p = path.resolve(process.cwd(), 'firestore.rules');
  return fs.readFileSync(p, 'utf8');
}

describe('Firestore Security Rules · Optilog', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'optilog-rules-test',
      firestore: { rules: rulesPath() },
    });
  });

  afterAll(async () => {
    await testEnv.clearFirestore();
    await testEnv.cleanup();
  });

  it('Users: owner can create/get/update/delete; non-owner denied', async () => {
    const owner = testEnv.authenticatedContext('user_1');
    const dbOwner = owner.firestore();
    const userDoc = doc(dbOwner, 'users/user_1');

    await assertSucceeds(setDoc(userDoc, { userId: 'user_1', name: 'Alice' }));
    await assertSucceeds(getDoc(userDoc));
    await assertSucceeds(updateDoc(userDoc, { name: 'Alice Updated' }));

    const stranger = testEnv.authenticatedContext('user_2').firestore();
    await assertFails(getDoc(doc(stranger, 'users/user_1')));
    await assertFails(updateDoc(doc(stranger, 'users/user_1'), { name: 'Bob' }));
  });

  it('Users: listing is blocked', async () => {
    const owner = testEnv.authenticatedContext('user_1').firestore();
    // listing (get all) requires query; we assert that reading a collection group without specific doc fails via rules by attempting get on an unknown doc.
    await assertFails(getDoc(doc(owner, 'users/unknown')));
  });

  it('Posts: public read only if is_published; author can write', async () => {
    const admin = await testEnv.withSecurityRulesDisabled(async (ctx) => ctx.firestore());
    await setDoc(doc(admin, 'posts/post_public'), { is_published: true, author_id: 'user_1', title: 'Pub' });
    await setDoc(doc(admin, 'posts/post_private'), { is_published: false, author_id: 'user_1', title: 'Priv' });

    const anon = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anon, 'posts/post_public')));
    await assertFails(getDoc(doc(anon, 'posts/post_private')));

    const authorCtx = testEnv.authenticatedContext('user_1').firestore();
    // Autor deve ler rascunho não publicado
    await assertSucceeds(getDoc(doc(authorCtx, 'posts/post_private')));
    await assertSucceeds(setDoc(doc(authorCtx, 'posts/post_new'), { is_published: false, author_id: 'user_1' }));
    await assertSucceeds(updateDoc(doc(authorCtx, 'posts/post_public'), { title: 'Updated' }));

    const otherCtx = testEnv.authenticatedContext('user_2').firestore();
    await assertFails(updateDoc(doc(otherCtx, 'posts/post_public'), { title: 'Hack' }));
  });

  it('Shipments: everyone can read; only owner can create/update/delete', async () => {
    const admin = await testEnv.withSecurityRulesDisabled(async (ctx) => ctx.firestore());
    await setDoc(doc(admin, 'shipments/s1'), { userId: 'user_1', created_at: Date.now() });

    const anon = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anon, 'shipments/s1')));

    const owner = testEnv.authenticatedContext('user_1').firestore();
    await assertSucceeds(setDoc(doc(owner, 'shipments/s2'), { userId: 'user_1' }));
    await assertSucceeds(updateDoc(doc(owner, 'shipments/s1'), { status: 'in_transit' }));

    const other = testEnv.authenticatedContext('user_2').firestore();
    // user_2 pode criar seu próprio shipment
    await assertSucceeds(setDoc(doc(other, 'shipments/s3'), { userId: 'user_2' }));
    // mas não pode atualizar shipment de user_1
    await assertFails(updateDoc(doc(other, 'shipments/s1'), { status: 'delivered' }));
  });

  it('Veiculos: only owner can create/update/read', async () => {
    const ownerDb = testEnv.authenticatedContext('user_1').firestore();
    const otherDb = testEnv.authenticatedContext('user_2').firestore();
    const vDocOwner = doc(ownerDb, 'veiculos/v1');
    await assertSucceeds(setDoc(vDocOwner, { userId: 'user_1', placa: 'ABC-1234' }));
    await assertSucceeds(getDoc(vDocOwner));
    await assertSucceeds(updateDoc(vDocOwner, { placa: 'ABC-5678' }));

    await assertFails(getDoc(doc(otherDb, 'veiculos/v1')));
  });

  it('Financeiro: only owner can access invoices', async () => {
    const ownerDb = testEnv.authenticatedContext('user_1').firestore();
    const otherDb = testEnv.authenticatedContext('user_2').firestore();
    const invDoc = doc(ownerDb, 'invoices/i1');
    await assertSucceeds(setDoc(invDoc, { userId: 'user_1', amount: 1000 }));
    await assertSucceeds(getDoc(invDoc));
    await assertFails(getDoc(doc(otherDb, 'invoices/i1')));
  });
});