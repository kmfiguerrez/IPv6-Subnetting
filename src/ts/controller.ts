import Prefix from "./ipv6.js";
import { render, renderWarningMessage } from "./view.js";

const ipv6AddressInput = document.getElementById("ipv6Address") as HTMLInputElement;
const prefixLengthInput = document.getElementById("prefixLength") as HTMLInputElement;
const subnetBitsInput = document.getElementById("subnetBits") as HTMLInputElement;
const outputSection = document.getElementById("outputSection") as HTMLDivElement;
const subnetNumberInput = document.getElementById("subnetNumber") as HTMLInputElement;


const checkInputs = function (ipv6Address: string, prefixLength: number, subnetBits: number, subnetToFind: string): boolean | Error {
    /**
     * This function will check user's inputs: ipv6 address, prefix length,
     * subnet bits and the particular subnet user's looking for.
     */

    try {
        const numOfNetworks = BigInt(2 ** subnetBits) - 1n;
        let errorCount = 0;
        let errorMessage = "";

        // Check the ipv6 address.
        if (Prefix.ipv6Format(ipv6Address) === false) {
            // Remove first the .is-valid if it's exists.
            ipv6AddressInput.classList.remove("is-valid");
            // Then add .is-invalid.
            ipv6AddressInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = "Invalid IPv6 Address Length!";
            errorCount++;
        }
        // Check the prefix length.
        if (prefixLengthInput.value === '' || prefixLength <= 0 || prefixLength >= 128) {
            // Remove first the .is-valid if it's exists.
            prefixLengthInput.classList.remove("is-valid");
            // Then add .is-invalid.
            prefixLengthInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = "Invalid Prefix Length!";
            errorCount++;
        }
        // Check the subnet bits.
        if (subnetBitsInput.value === '' || subnetBits < 0 || prefixLength + subnetBits >= 126) {
            // Remove first the .is-valid if it's exists.
            subnetBitsInput.classList.remove("is-valid");
            // Then add .is-invalid.
            subnetBitsInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = "Invalid Subnet Bits!";
            errorCount++;
        }   
        // Check the subnet that is looking for.
        if (BigInt(subnetToFind) < 0 || BigInt(subnetToFind) > numOfNetworks ) {
            // Set error message.
            errorMessage = `Subnet ${subnetToFind} does not exists!`;
            errorCount++;
        }
        
        // If there's an error.
        if (errorCount > 1) {
            // If there's more than one error, set the new error messsage.
            errorMessage = "Incorrect IP Information!";
            throw new Error(errorMessage);            
        } else if (errorCount === 1) {
            // If there's only one error, use the particular message.
            throw new Error(errorMessage);            
        }

        // Otherwise valid, return true.
        return true;

    } catch (error: any) {
        console.log(error);
        return new Error(error.message);
    }        
}


export const getPrefix = function (subnetToFind: string="0"): void {
    /**
     * This function will respond to the click events from the form's
     * button element.
     * This functions takes an optional argument of type string, because
     * by default it will calculate the subnet zero.
     * It will get the user's input: ipv6 address, prefix length
     * and subnet bits.
     * It will call the render method to display the results in the
     * HTML document.      
    */

    const ipv6Value = ipv6AddressInput.value;
    const prefixLengthValue = parseInt(prefixLengthInput.value);
    const subnetBitsValue = parseInt(subnetBitsInput.value);
    const numOfSubnets = BigInt(2 ** subnetBitsValue);

    // Check user inputs
    const result = checkInputs(ipv6Value, prefixLengthValue, subnetBitsValue, subnetToFind);
    // If they are invalid, then display error messages.
    if (result instanceof Error) {
        renderWarningMessage(result, outputSection);
        return;
    }

    // Otherwise valid, proceed with the following codes.

    // Get the prefix.
    const prefix = Prefix.getPrefix(ipv6Value, prefixLengthValue, subnetBitsValue, subnetToFind) as Prefix;

    // Set the max attribute of the subnet number input for users convenience.    
    subnetNumberInput.setAttribute("max", `${numOfSubnets - 1n}`);

    // Display the prefix.
    render(prefix);
}