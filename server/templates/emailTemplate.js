// emailTemplate.js
export const getBookingConfirmationEmail = (booking) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e4e8; border-radius: 10px; overflow: hidden; color: #333;">
      <!-- Header -->
      <div style="background-color: #2c3e50; padding: 25px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0;">Booking Confirmed</h2>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Thank you for your booking. Your travel details are below:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-left: 5px solid #3498db; margin: 20px 0;">
          <p style="margin: 5px 0; font-size: 18px;"><strong>PNR:</strong> ${booking.pnr}</p>
        </div>

        <h3 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Journey Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${booking.Tickets.map(t => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Coach:</strong> ${t.Seat.coach}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Seat:</strong> ${t.Seat.seat_number}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Class:</strong> ${t.Seat.class_type}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © 2026 Your Company Name. All rights reserved.
      </div>
    </div>
  `;
};