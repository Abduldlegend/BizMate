
import React, { useEffect, useState } from "react";

const ExchangeRates = () => {
    const [rates, setRates] = useState({});
    const [base, setBase] = useState("USD");
    const [symbols, setSymbols] = useState({});
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [converted, setConverted] = useState(null);

  // Fetch all currencies
    useEffect(() => {
        fetch("https://api.exchangerate.host/symbols")
        .then((res) => res.json())
        .then((data) => setSymbols(data.symbols));
    }, []);

  // Fetch rates for base currency
    useEffect(() => {
        fetch(`https://api.exchangerate.host/latest?base=${base}`)
        .then((res) => res.json())
        .then((data) => setRates(data.rates));
    }, [base]);

  // Convert function
    const convertCurrency = () => {
        fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
        )
        .then((res) => res.json())
        .then((data) => setConverted(data.result));
    };

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 my-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">💱 Exchange Rates</h2>

            {/* Currency Converter */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Currency Converter</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full sm:w-32"
                />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-32"
          >
            {Object.keys(symbols).map((code) => (
              <option key={code} value={code}>
                {code} - {symbols[code].description}
              </option>
            ))}
          </select>
          <span className="text-xl">➡️</span>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-32"
          >
            {Object.keys(symbols).map((code) => (
              <option key={code} value={code}>
                {code} - {symbols[code].description}
              </option>
            ))}
          </select>
          <button
            onClick={convertCurrency}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Convert
          </button>
        </div>
        {converted !== null && (
          <p className="mt-3 text-lg font-bold text-green-600">
            {amount} {fromCurrency} = {converted.toFixed(2)} {toCurrency}
          </p>
        )}
      </div>

      {/* Global Exchange Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Global Exchange Rates (Base: {base})
        </h3>
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="border rounded-lg px-3 py-2 mb-4"
        >
          {Object.keys(symbols).map((code) => (
            <option key={code} value={code}>
              {code} - {symbols[code].description}
            </option>
          ))}
        </select>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-3 py-2">Currency</th>
                <th className="border px-3 py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rates)
                .slice(0, 50) // show top 50 to avoid overload
                .map(([currency, rate]) => (
                  <tr key={currency} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">{currency}</td>
                    <td className="border px-3 py-2">{rate.toFixed(4)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRates;
