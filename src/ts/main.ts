import { getPrefix } from "./controller.js";
import Prefix from "./ipv6.js";


const formButton = document.getElementById("formButton") as HTMLButtonElement;
const forms = document.querySelectorAll('form');
const formInputs = document.querySelectorAll("input[class='form-control']") as NodeListOf<HTMLInputElement>;
const subnetNumberInput = document.getElementById("subnetNumber") as HTMLInputElement;
const host = document.getElementById("host") as HTMLSpanElement;


// Event listeners.

Array.from(forms).forEach(form => {
    // Add event handlers to form elements.
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();                
    })
})

Array.from(formInputs).forEach(input => {    
    // Add event handlers to each form input.
    input.addEventListener("change", function () {
        // Remove first the .is-invalid if it's exists.
        input.classList.remove("is-invalid");

        // Check if the input value is empty or not.
        if (this.value === "") {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        } else {
            input.classList.add("is-valid");
        }
    })
})

formButton.addEventListener("click", () => {
    // By default, display the first subnet(subnet zero).

    // Make sure first that the subnet number always starts with 0.
    subnetNumberInput.value = "0";

    // reset host value.
    host.innerHTML = "0";

    /*
     The getPrefix() will calculate the prefix and display
     the results.
    */
    getPrefix(0);
})

subnetNumberInput.addEventListener("change", () => {
    // Get the subnet number.
    const subnetToFind = parseInt(subnetNumberInput.value);        

    // Get the prefix based on subnet number.
    getPrefix(subnetToFind);
})



const res = Prefix.binToHex("1111111111111111111111111111111111111111111111111111111111111111");
console.log(res)