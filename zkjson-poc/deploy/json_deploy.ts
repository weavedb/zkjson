
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const gasPrice = '20000000000';


  const json = await deploy("Json", {
    from: deployer,
    args: ["0x5FbDB2315678afecb367f032d93F642f64180aa3"],
    log: true,
    waitConfirmations: 10,
    gasPrice
  });

  console.log("Json deployed at: ", json.address);
  
};

deploy.tags = ["Json"];
export default deploy;