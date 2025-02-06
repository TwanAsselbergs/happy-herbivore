import { ArrowLeft } from "lucide-react";

const Order = () => {
  return (
    <main className="flex flex-col justify-between text-xl w-full h-screen overflow-x-hidden">
      <div className="bg-white-primary px-4">
        <img
          src="/img/logo_big_happy_herbivore_transparent.webp"
          alt=""
          className="w-full max-w-[225px]"
        />
      </div>
      <div className="bg-white-secondary w-full h-full flex justify-center">
        <div className="flex flex-col justify-between items-center bg-white-primary rounded-3xl w-11/12 h-[1400px] mx-auto mt-28 px-16">
          <h2 className="text-2xl font-bold tracking-wide flex items-center my-20">
            <ArrowLeft
              height={50}
              width={50}
              strokeWidth={2.5}
              className="absolute left-35"
            />
            Review your Order
          </h2>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <img
                src="/img/eggcelent-wrap.png"
                alt=""
                className="w-40 h-40 object-cover rounded-2xl"
              />
              <div className="ml-10 tracking-wide">
                <h3 className="text-[28px] font-semibold">Eggcelent Wrap</h3>
                <p className="text-[28px] font-semibold mt-4">
                  €7.00{" "}
                  <span className="text-gray-400 font-normal">
                    (€3.50 per piece)
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-xl font-bold bg-gray-100 rounded-full p-8 h-20 flex items-center">
                -
              </button>
              <input
                type="number"
                className="w-12 text-center font-bold"
                value="1"
                min="1"
              />
              <button className="text-xl font-bold bg-gray-100 rounded-full p-8 h-20 flex items-center">
                +
              </button>
            </div>
          </div>
          <button className="text-white bg-lime-500 px-54 py-8 rounded-full my-20 font-semibold tracking-wide">
            Proceed to checkout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Order;