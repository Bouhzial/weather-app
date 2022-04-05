import React from "react";
import cities from "../../lib/city.list.json";

export async function getServerSideProps(context) {
  const slug = context.params.city;
  const city = getCity(slug);

  if (!city) {
    return {
      notFound: true,
    };
  }
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&exclude=minutely&units=metric`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }
  console.log(data);

  return {
    props: {
      slug: slug,
    },
  };
}

const getCity = (params) => {
  const citypram = params.trim();
  const splitcity = citypram.split("-");
  const ID = splitcity[splitcity.length - 1];
  if (!ID) {
    return null;
  }
  city = cities.find((city) => city.id.toString() == ID);
  if (city) {
    return city;
  } else {
    return null;
  }
};

export default function city({ slug }) {
  return (
    <div>
      <h1>city</h1>
      <h2>{slug}</h2>
    </div>
  );
}
