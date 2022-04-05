import React from "react";
import cities from "../lib/city.list.json";
import Link from "next/link";

export default function Searchbox() {
  const [query, setquery] = React.useState("");
  const [result, setresult] = React.useState([]);

  const onChange = (e) => {
    const { value } = e.target;
    setquery(value);

    let matchingCities = [];

    if (value.length > 3) {
      for (let city of cities) {
        if (matchingCities.length > 5) {
          break;
        }
        const match = city.name.toLowerCase().startsWith(value.toLowerCase());

        if (match) {
          const CityData = {
            ...city,
            slug: `${city.name.toLowerCase().replace(/ /g, "-")}-${city.id}`,
          };
          matchingCities.push(CityData);
        }
      }
      return setresult(matchingCities);
    }
  };
  return (
    <div className="search">
      <input type="text" value={query} onChange={onChange} />

      {query.length > 3 && (
        <ul>
          {result.length > 0 ? (
            result.map((city) => (
              <li key={city.slug}>
                <Link href={`/location/${city.slug}`}>
                  <a>
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}
                    <span>{city.country}</span>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <h1>no resulte</h1>
          )}
        </ul>
      )}
    </div>
  );
}
