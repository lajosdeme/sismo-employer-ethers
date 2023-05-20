const ethers = require('ethers');

const employerAbi = require("./abis/employerAbi.json");

class Ethers {
    constructor() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.provider = provider
        this.signer = this.provider.getSigner();

        this.employer = new ethers.Contract("0x1d00C469BD8e806F9Be5b390687c58852A8256e3", employerAbi, this.signer);

        window.ethereum.on("accountsChanged", async () => {
            await this.connect();
            window.location.reload();
        })
    }

    connect = async function () {
        await this.provider.send("eth_requestAccounts", []);
        this.address = await this.signer.getAddress();
        console.log("Connected address is: ", this.address)
    }

    addVerifiedEmployee = async(response) => {
        try {
            const tx = await this.employer.addVerifiedEmployee(response);
            await tx.wait();
            return true;
        } catch(e) {
            if (e.error === (undefined)) {
                console.log("error: ", e.message)
                alert(e.message)
                return false
            }
            console.log("an error occurred: ", e.error.message)
            alert(e.error.message)
            return false
        }
    }

    isVerifiedEmployee = async(address) => {
        const isVerified = await this.employer.isVerifiedEmployee(address);
        return isVerified;
    }
}

export default Ethers;