import { connect, disconnect } from "../db/connection";
import { Deals, DealStages } from "../db/models";

beforeAll(() => connect());

afterAll(() => disconnect());

/**
 * Deals related tests
 */
describe("Deals", () => {
  afterEach(async () => {
    // Clearing test deals
    await Deals.remove({});
    await DealStages.remove({});
  });

  test("Create Deal:", async () => {
    const stage = await DealStages.create({ name: "stageName" });

    const doc = {
      name: "testDeal",
      stageId: stage._id,
      assignedUserIds: ["1231", "123312"],
      customerIds: ["123312", "21321"],
      description: "description",
      closeDate: new Date(),
      order: 1,
      productsData: { productId: "123" }
    };

    const response = await Deals.createDeal(doc);

    expect(response.name).toBe(doc.name);
    expect(response.stageId).toBe(stage._id);

    expect(response.assignedUserIds).toEqual(
      expect.arrayContaining(["1231", "123312"])
    );

    expect(response.customerIds).toEqual(
      expect.arrayContaining(["123312", "21321"])
    );

    expect(response.closeDate).toBeDefined();
    expect(response.description).toBe("description");
    expect(response.order).toBe(1);

    expect(response.productsData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // 3
          productId: "123" // 4
        })
      ])
    );
  });
});
