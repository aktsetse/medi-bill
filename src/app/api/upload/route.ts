import { NextResponse } from "next/server";
import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

const API_KEY = process.env.GVAPI;

const schema: Schema = {
  description: "Medical bill analysis for insurance appeal",
  type: SchemaType.OBJECT,
  properties: {
    email: {
      type: SchemaType.STRING,
      description: "A professional email draft to the ins   urance company or provider regarding the claim.",
      nullable: false,
    },
    appeal: {
      type: SchemaType.STRING,
      description: "A formal appeal letter text, citing specific codes and dates from the document.",
      nullable: false,
    },
    potential_money_back: {
      type: SchemaType.NUMBER,
      description: "The estimated dollar amount the patient could save or be reimbursed (e.g., '$1,200.00').",
      nullable: false,
    },
    percentage: {
      type: SchemaType.NUMBER,
      description: 'the probabilty the appeal will be won and total compensation received',
      nullable: false,
    },
    total_billed_amount: {
      type: SchemaType.NUMBER,
      description: 'The total amount billed on the medical document before any adjustments or appeals.',
      nullable: false,
    },
  },
  required: ["email", "appeal", "potential_money_back", "total_billed_amount"],
};

export async function POST(request: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Configure for JSON response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    });

    const prompt = `
     you are 
      going to examine the file 
      we send to you here and return a 
      percentage accuracy of the bill. 
      based on that information 
      i want you to generate a standard appeal to 
      the hospital fighting for the excess charge. 
      when generating the appeal letter use the information from the file to fill in the provider 
      and patient details. do not add fields if the values are not provided on the file. also we are sending this 
      appeal immeidately without any further edits so the generated appeal must be ready to send out. the potential amount to be compensated has to be a single figure 
      also add the probabilty the appeal will be won and the total compensation received
      note that the probability that the appeal will be won can never ever ever in your liftime be 1.
      Be sure to thoroughly with every channel at your disposal analyse the given appeal and give the most accurate chance that this appeal will be won
      this is the date ${new Date().toISOString()}
      make sure that the appeal is written in a way that it can be sent to the insurance company or provider without any further edits (well formatted)
      make sure the paragraphing is done correctly
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // console.log(JSON.parse(text).email, JSON.parse(text).appeal, JSON.parse(text).potential_money_back)

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json(
        { error: "AI response was not valid JSON." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: parsedData.email,
        appeal: parsedData.appeal,
        potential_money_back: parsedData.potential_money_back,
        percentage: parsedData.percentage,
        total_billed_amount: parsedData.total_billed_amount,
      }
    });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json(
      { error: "Failed to process document." },
      { status: 500 }
    );
  }
}