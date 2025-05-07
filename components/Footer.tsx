export default function Footer({
  datasources,
}: {
  datasources: Record<string, Record<string, string>>;
}) {
  console.log("datasources", datasources);
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          
          <span className="ml-2 text-lg">Sprängi Bar & Cafe</span>
        </div>
        <div className="flex space-x-4">
         
        </div>
      </div>
    </footer>
  );
}