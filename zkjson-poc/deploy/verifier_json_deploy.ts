import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  console.log("Deployer account: ", deployer);

  const groth16VerifierJSON = await deploy("Groth16VerifierJSON", {
    from: deployer,
    log: true,
    waitConfirmations: 10
  });

  if (groth16VerifierJSON.newlyDeployed) {
    console.log(`Groth16VerifierJSON deployed at ${groth16VerifierJSON.address}`);
  } else {
    console.log(`Groth16VerifierJSON already deployed at ${groth16VerifierJSON.address}`);
  }
};

deploy.tags = ["Groth16VerifierJSON"];
export default deploy;