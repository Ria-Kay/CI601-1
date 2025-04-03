import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend
} from 'recharts';

export default function PieChartVisualizer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comics = await fetch('/api/proxy?query=batman&limit=100')
        .then((res) => res.json())
        .then((data) => data.results || []);

      // Group by year
      const grouped = {};
      comics.forEach((comic) => {
        const year = comic.cover_date?.split('-')[0] || 'Unknown';
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(comic);
      });

      const formatted = Object.entries(grouped).map(([year, comics], i) => ({
        name: year,
        value: comics.length,
        image: comics[0]?.image?.thumb_url,
      }));

      setData(formatted);
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <defs>
          {data.map((entry, i) => (
            <pattern
              key={i}
              id={`cover-${i}`}
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <image
                href={entry.image}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          ))}
        </defs>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={160}
          label
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={`url(#cover-${i})`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
