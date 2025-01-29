import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICommon } from "../../../../Interfaces/ICommon";
import "./UsefulNumbersDirectory.css";

export interface PhoneNumber {
    Title: string;
    Number: string;
    Category: string;
    Region: string;
  }

export interface IUsefullNumberProps {
    context: WebPartContext;
    usefullNumber : PhoneNumber;
    // searchOnClick?:React.ReactEventHandler<HTMLInputElement>;
}

export interface IUsefullNumberState {
    searchResults: PhoneNumber[];
    selectedItem: any;
    selectedCategory: ICommon;
    categoryError: boolean,
}