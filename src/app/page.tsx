import ConverterForm from "@/components/ConverterForm";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Currency & Cost of Living</h1>
      <p className="mb-4 text-gray-600 text-center">Convert currencies with purchasing power parity adjustments.</p>
      <ConverterForm />
    </div>
  );
}
