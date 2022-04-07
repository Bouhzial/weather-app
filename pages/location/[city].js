import React from "react";
import cities from "../../lib/city.list.json";
import Head from "next/head";
import TodayWeather from "../../components/TodayWeather";
import moment from "moment-timezone";
import DailyWeather from "../../components/DailyWeather";
import WeaklyWeather from "../../components/WeaklyWeather";
export async function getServerSideProps(context) {
  const slug = context.params.city;
  const city = getCity(slug);

  if (!city) {
    return {
      notFound: true,
    };
  }
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=930b11fbec444a565010c99a96755432&exclude=minutely&units=metric`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      city: city,
      currentWeather: data.current,
      dailyWeather: data.daily,
      Hourlyweathee: getHourly(data.hourly, data.timezone),
      timezone: data.timezone,
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

const getHourly = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf("day").valueOf();
  const endTimeStamp = Math.floor(endOfDay / 1000);

  const todaysData = hourlyData.filter((data) => data.dt < endTimeStamp);

  return todaysData;
};

export default function city({
  Hourlyweathee,
  city,
  dailyWeather,
  currentWeather,
  timezone,
}) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather</title>
      </Head>
      <div className="page-wrapper">
        <div className="container">
          <TodayWeather
            city={city}
            weather={dailyWeather[0]}
            timezone={timezone}
          />
          <DailyWeather Hourlyweather={Hourlyweathee} timezone={timezone} />
          <WeaklyWeather WeaklyWeather={dailyWeather} timezone={timezone} />
        </div>
      </div>
    </div>
  );
}
