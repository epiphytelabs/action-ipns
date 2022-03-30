const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const { create } = require("ipfs-http-client");

async function main() {
	try {
		let options = {
			host: core.getInput("host"),
			port: core.getInput("port"),
			protocol: core.getInput("protocol"),
		};

		const auth = core.getInput("auth");

		if (auth !== "") {
			options.headers = {
				authorization: "Basic " + Buffer.from(auth).toString("base64"),
			};
		}

		const ipfs = create(options);
		const repo = github.context.repo.owner + "/" + github.context.repo.repo;
		const keys = await ipfs.key.list();

		if (!keys.find((k) => k.name === repo)) {
			const key = await ipfs.key.gen(repo, {
				type: "rsa",
				size: 2048,
			});
		}

		const result = await ipfs.name.publish(core.getInput("cid"), { key: repo });
		const name = result.name;
		core.setOutput("name", name);

		console.log("Published", name);
	} catch (error) {
		core.setFailed(error.message);
		throw error;
	}
}

main();
