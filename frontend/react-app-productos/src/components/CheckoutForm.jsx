// components/CheckoutForm.jsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function CheckoutForm({ clientSecret, alTerminar }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const resultado = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement) }
        });

        if (resultado.error) {
            alert(resultado.error.message);
        } else {
            if (resultado.paymentIntent.status === 'succeeded') {
                alert("¡Pago exitoso!");
                alTerminar();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement className="stripe-input" />
            <button className="login-btn" style={{marginTop: '20px'}}>Confirmar Pago</button>
        </form>
    );
}