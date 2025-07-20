import Header from "./components/header";
import TourismDesign from "./tourismDesign";

export default function Test() {
  return (
    <>
      <Header />
        <TourismDesign />
      <div className="bg-gray-100 p-4">
        <h1>Test Page</h1>
        <p>This is a test page.</p>
      </div>
    </>
  );
}
