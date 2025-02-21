import { Button, Table } from 'react-bootstrap';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Paginate from '../../components/Paginate';

const OrderListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetOrdersQuery({ pageNumber });

  return (
    <>
      <h1>Orders</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {data?.orders?.length === 0 && !isLoading && (
        <Message variant="info">No orders</Message>
      )}

      <Paginate
        pages={data?.pages}
        page={data?.page}
        isAdmin={true}
        purpose="orderlist"
      />
    </>
  );
};

export default OrderListScreen;
