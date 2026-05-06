// Razorpay Payment Configuration
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';
// Note: Never expose your secret key in frontend code

// Initiate Payment
function initiatePayment() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('checkoutEmail').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    
    // Validation
    if (!fullName || !email || !phone || !address || !city || !postalCode) {
        showNotification('Please fill all fields');
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Razorpay Options
    const options = {
        key: RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: totalAmount * 100, // Amount in paise (multiply by 100)
        currency: 'INR',
        name: 'StyleHub',
        description: 'Clothing Purchase',
        prefill: {
            name: fullName,
            email: email,
            contact: phone
        },
        notes: {
            address: address,
            city: city,
            postalCode: postalCode
        },
        handler: function(response) {
            handlePaymentSuccess(response, {
                fullName,
                email,
                phone,
                address,
                city,
                postalCode
            });
        },
        modal: {
            ondismiss: handlePaymentFailure
        },
        theme: {
            color: '#6366f1'
        }
    };
    
    // Create Razorpay instance
    const rzp = new Razorpay(options);
    
    // Handle payment failure
    rzp.on('payment.failed', function(response) {
        handlePaymentFailure();
    });
    
    // Open Razorpay Checkout
    rzp.open();
}

// Handle Payment Success
async function handlePaymentSuccess(razorpayResponse, orderDetails) {
    try {
        // Verify payment on backend (recommended)
        const verificationData = {
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature
        };
        
        // Save order to Supabase
        const orderData = {
            user_id: currentUser.id,
            customer_name: orderDetails.fullName,
            email: orderDetails.email,
            phone: orderDetails.phone,
            address: orderDetails.address,
            city: orderDetails.city,
            postal_code: orderDetails.postalCode,
            total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            payment_id: razorpayResponse.razorpay_payment_id,
            payment_status: 'completed',
            items: JSON.stringify(cart),
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([orderData]);
        
        if (error) throw error;
        
        // Clear cart
        cart = [];
        saveCartToLocalStorage();
        updateCartCount();
        
        // Close checkout modal
        closeCheckoutModal();
        
        // Show success message
        showPaymentSuccessModal(razorpayResponse.razorpay_payment_id, orderDetails.fullName);
        
    } catch (error) {
        console.error('Error saving order:', error);
        showNotification('Error saving order. Please contact support.');
    }
}

// Handle Payment Failure
function handlePaymentFailure() {
    showNotification('Payment failed. Please try again.');
}

// Show Payment Success Modal
function showPaymentSuccessModal(paymentId, customerName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <h2 style="color: #10b981; margin-bottom: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem;"></i>
            </h2>
            <h3>Payment Successful!</h3>
            <p style="color: #718096; margin: 1rem 0;">Thank you for your purchase, ${customerName}!</p>
            <p style="color: #718096; margin: 1rem 0;">Payment ID: <strong>${paymentId}</strong></p>
            <p style="color: #718096; margin: 1rem 0;">A confirmation email has been sent to your email address.</p>
            <button class="submit-btn" onclick="completeCheckout()" style="width: 100%; margin-top: 1rem;">
                Continue Shopping
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Complete Checkout
function completeCheckout() {
    // Remove all modals
    document.querySelectorAll('.modal').forEach(m => m.remove());
    
    // Redirect to home
    window.location.reload();
}

// Verify Payment Signature (Server-side implementation)
/*
Backend implementation for payment verification:

const crypto = require('crypto');

function verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    const secret = process.env.RAZORPAY_SECRET_KEY;
    const hmac = crypto.createHmac('sha256', secret);
    
    const message = razorpay_order_id + "|" + razorpay_payment_id;
    hmac.update(message);
    
    const signature = hmac.digest('hex');
    
    return signature === razorpay_signature;
}
*/