import React from 'react';
import { Card, EmptyState, LoadingSkeleton } from '@/components/ui';
import { MUILoaderIcon, MUIUniqueIdIcon } from '@mui/icons-material';
import { ServiceOrder, ChecklistItem, Part, Photo } from './types';
import './styles.css'; // Importing global styles for gradient background and responsive design

const MecanicoPage = () => {
  const [orders, setOrders] = React.useState<ServiceOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch service orders from the API
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Simulated API call
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const renderOrders = () => {
    if (orders.length === 0) {
      return <EmptyState message="No orders available" />;
    }
    return orders.map(order => <OrderCard key={order.id} order={order} />);
  };

  return (
    <div className="bg-gradient">
      <header>
        <h1>Mechanic App</h1>
      </header>
      <StatsGrid orders={orders} />
      <section>
        {loading ? <LoadingSkeleton /> : renderOrders()}
      </section>
      <ActionButtons />
    </div>
  );
};

const StatsGrid = ({ orders }) => {
  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    urgent: orders.filter(o => o.status === 'urgent').length,
  };
  // Render grid based on stats
};

const OrderCard = ({ order }) => {
  return (
    <Card>
      <h2>Order ID: {order.id}</h2>
      <div className={`badge ${order.status}`}>{order.status}</div>
      {/* Further order details and components here */}
    </Card>
  );
};

const ActionButtons = () => (
  <div className="actions">
    <button onClick={() => console.log('Start Work')}>Start Work</button>
    <button onClick={() => console.log('Continue')}>Continue</button>
    <button onClick={() => console.log('Complete')}>Complete</button>
  </div>
);

export default MecanicoPage;
