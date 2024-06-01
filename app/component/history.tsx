"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryAID {
  title: string;
  url: string;
  year: number;
}

export default function History() { 
  const [isMounted, setIsMounted] = useState(false);

  const [data, setData] = useState<HistoryAID[]>([])

  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let year = 2023; year <= currentYear; year++) {
    yearsArray.push(year);
  }

  const notionFetcher = async () => {
    const response = await fetch(`/api/dev`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response.status);
  }

  const historyFetcher = async () => {
    const res = await fetch('/history.json');
    if (res.status == 200) {
      const json: HistoryAID[] = await res.json();
      setData(json);
    }
  }

  useEffect(() => {
    historyFetcher();
    setIsMounted(true);
  } , [])

  return (
    <section className="" id="History">
      <button 
        className="bg-red-500 text-white px-5 py-5"
        onClick={(e)=>notionFetcher()}
      >
        json 생성
      </button>
      {
        yearsArray.map((year, index) => {
          return (
            <div className="flex justify-between gap-36" key={year}>
              <h1 className="px-8 py-5">{year}</h1>
              <div className="flex flex-1 flex-col">
              {
                data.map((element, index) => {
                  if (element.year == year)
                  return (
                    <Link
                      target="_blank"
                      href={element.url}
                      className="text-right px-8 py-5 border-b-2 border-gray-300"
                      key={index}
                    >
                      {element.title}
                    </Link>
                  )
                })
              }
              </div>
            </div>
          )
        })
      }
    </section>
  );
}
