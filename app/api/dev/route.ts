import { NextResponse, NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';

async function fetchNotionData(pageID: string, notionKey: string | undefined) {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${pageID}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
                'Authorization': `Bearer ${notionKey}`,
            },
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const notionKey = process.env.NOTION_KEY;
    const pageID: string = '28dfae8dfc694303861f61738dd50390';

    const data = await fetchNotionData(pageID, notionKey);
    // console.log(data);
    if (!data) {
        return new NextResponse(null, {
            status: 500,
        });
    }

    const modified = data.results.map((element: any) => {
        let year = 2023;
        element.properties.Tags.multi_select.forEach((tag: any) => {
            if (parseInt(tag.name)) year = parseInt(tag.name);
        });
        return {
            title: element.properties.Name.title[0].text.content,
            url: element.public_url,
            year: year,
        };
    });

    try {
        await writeFile('public/history.json', JSON.stringify(modified));
    } catch (e) {
        console.error(e);
        return new NextResponse(null, {
            status: 500,
        });
    }

    const recruitDataID: string = '7b6a34d36a0d47ff8af08ac2c5f6d88a';
    const recruitPageID: string = '788a6802-ef41-4be8-bfb8-711698128fc7';

    let recruitDate = {
        start: '2024-01-01',
        end: '2024-01-02',
        time_zone: null,
    };
    let recruitUrl = '';

    const recruitData = await fetchNotionData(recruitDataID, notionKey);
    recruitData.results.map((element: any) => {
        console.log(element.id);
        if (element.id == recruitPageID) {
            console.log(element.properties.날짜.id);
            recruitDate = element.properties.날짜.date;
            recruitUrl = element.properties.비고.rich_text[0].href;

            console.log({ recruitDate, recruitUrl });
        }
    });

    try {
        await writeFile('public/recruit.json', JSON.stringify({ recruitDate, recruitUrl }));
    } catch (e) {
        console.error(e);
        return new NextResponse(null, {
            status: 500,
        });
    }

    return new NextResponse(null, {
        status: 200,
    });
}
