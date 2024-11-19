import SubscriptionForm from './SubscriptionFormProps';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <SubscriptionForm 
          onSubscribe={(username) => {
            console.log(`${username} subscribed successfully`);
          }}
        />
      </div>
    </div>
  );
}