/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "browserbase-tool",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const ANTHROPIC_API_KEY = new sst.Secret("ANTHROPIC_API_KEY");

    const vpc = new sst.aws.Vpc("MyVpc");

    const cluster = new sst.aws.Cluster("MyCluster", { vpc });
    cluster.addService("MyService", {
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      dev: {
        command: "bun dev",
      },
      environment: {
        ANTHROPIC_API_KEY: ANTHROPIC_API_KEY.value,
      },
    });
  },
});
