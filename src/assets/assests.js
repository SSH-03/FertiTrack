import FertiTrack_icon from "./FertiTrack_icon.png";
import logout_icon from "./logout_icon.png";
import profile_icon from "./profile_icon.png";
import add_big_icon from "./add_big_icon.png";
import add_icon from "./add_icon.png";
import remove_icon from "./remove_icon.png";
import contant_icon from "./contant_icon.png";

export const assets = {
    FertiTrack_icon,
    logout_icon,
    profile_icon,
    add_big_icon,
    add_icon,
    remove_icon,
    contant_icon

};

export const customers = [
    { name: "Midhun", phone: 6300188045, _id: "MA", village: "Chirala" },
    { name: "Revanth", phone: 8519885922, _id: "RR", village: "Nandyala" },
];

export const ferti_products = [
    {
        _id: "Produ1",
        name: "FetriOne1",
        image: FertiTrack_icon,
        next_dose: 2,
        dose_measure: "month",
        unitprice: 44,
        quantityType: "KG",

        quantity: 300,
        description: "One product which is added best sale",
    },
    {
        _id: "Produ2",
        name: "FetriTwo2",
        image: FertiTrack_icon,
        next_dose: 2,
        dose_measure: "month",
        unitprice: 44,
        quantityType: "KG",
        quantity: 400,
        description: "Second product which is added best sale",
    },
];
