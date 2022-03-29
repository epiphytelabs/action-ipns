const core = require("@actions/core");
const path = require("path");

const ipns = require("ipfs-http-client").create({ core.getInput("host"), port: core.getInput("port"), protocol: "https" });

async function main() {
	try {
		const result = await ipns.name.publish(core.getInput("cid"));
		const name = result.name;

		core.setOutput("name", name);

		console.log("Published", name);
	} catch (error) {
		core.setFailed(error.message);
		throw error;
	}
}

main();
