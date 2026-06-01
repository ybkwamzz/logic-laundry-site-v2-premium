import { OrderStatus } from '../types';
import { mockOrders } from '../data';

/**
 * Simulates a real-time order tracking API endpoint over a standard HTTP interface.
 * Returns a Promise that resolves after a realistic network latency (1.2 seconds)
 * to allow testing of loading skeleton states and asynchronous states in the client.
 * 
 * Target Endpoint: GET /api/tracking?query=...
 */
export function mockFetchTracking(
  query: string,
  customOrders: OrderStatus[] = []
): Promise<Response> {
  return new Promise((resolve) => {
    // Simulate natural 1200ms network latency
    setTimeout(() => {
      const trimmedQuery = query.trim().toLowerCase();
      
      if (!trimmedQuery) {
        const errorResponse = {
          success: false,
          error: 'BadRequest',
          message: 'Tracking ID or phone number is required.'
        };
        resolve(
          new Response(JSON.stringify(errorResponse), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        );
        return;
      }

      // Combine default mock data with modern custom bookings registered in current session
      const allOrders = [...customOrders, ...mockOrders];

      // Find the order: match by ID (case-insensitive) or phone number (stripping whitespace)
      const foundOrder = allOrders.find((order) => {
        const matchesId = order.orderId.toLowerCase() === trimmedQuery;
        const matchesPhone = order.phone.replace(/\s+/g, '') === trimmedQuery.replace(/\s+/g, '');
        return matchesId || matchesPhone;
      });

      if (foundOrder) {
        const successResponse = {
          success: true,
          data: foundOrder,
          receivedAt: new Date().toISOString(),
          status: 'ok'
        };
        resolve(
          new Response(JSON.stringify(successResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        );
      } else {
        const notFoundResponse = {
          success: false,
          error: 'NotFound',
          message: `No active order found matching tracking ID or phone: "${query}"`
        };
        resolve(
          new Response(JSON.stringify(notFoundResponse), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          })
        );
      }
    }, 1200);
  });
}
