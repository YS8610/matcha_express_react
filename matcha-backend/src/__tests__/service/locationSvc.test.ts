import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import ConstMatcha from "../../ConstMatcha.js";
import * as locationSvc from "../../service/locationSvc.js";

describe("locationSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getUserLocation", () => {
    it("getUserLocation : retrieves user location correctly", async () => {
      const mockCoordinates = [12.3456789, 98.7654321];
      const findOneMock = vi.fn().mockResolvedValue({ location: { type: "Point", coordinates: mockCoordinates } });
      const collectionMock = vi.fn().mockReturnValue({ findOne: findOneMock });
      const dbMock = { collection: collectionMock } as any;
      const getDbMock = vi.fn().mockResolvedValue(dbMock);
      const location = await locationSvc.getUserLocation("user1", getDbMock);
      expect(location).toEqual({ longitude: mockCoordinates[0], latitude: mockCoordinates[1] });
      expect(getDbMock).toHaveBeenCalled();
      expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_LOCATION);
      expect(findOneMock).toHaveBeenCalledWith({ userId: "user1" });
    });

    it("getUserLocation : returns null if user location not found", async () => {
      const findOneMock = vi.fn().mockResolvedValue(null);
      const collectionMock = vi.fn().mockReturnValue({ findOne: findOneMock });
      const dbMock = { collection: collectionMock } as any;
      const getDbMock = vi.fn().mockResolvedValue(dbMock);
      const location = await locationSvc.getUserLocation("user2", getDbMock);
      expect(location).toBeNull();
      expect(getDbMock).toHaveBeenCalled();
      expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_LOCATION);
      expect(findOneMock).toHaveBeenCalledWith({ userId: "user2" });
    });
  });

  describe("updateUserLocation", () => {
    it("updateUserLocation : updates user location correctly", async () => {
      const updateOneMock = vi.fn().mockResolvedValue({});
      const collectionMock = vi.fn().mockReturnValue({ updateOne: updateOneMock });
      const dbMock = { collection: collectionMock } as any;
      const getDbMock = vi.fn().mockResolvedValue(dbMock);
      await locationSvc.updateUserLocation("1", "user1", 12.345678, 98.765432, getDbMock);
      expect(getDbMock).toHaveBeenCalled();
      expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_LOCATION);
      expect(updateOneMock).toHaveBeenCalledWith(
        { userId: "1" },
        {
          $set: {
            userId: "1",
            username: "user1",
            updatedAt: expect.any(Number),
            location: {
              type: "Point",
              coordinates: [98.765432 + 0.000000001, 12.345678 + 0.000000001]
            }
          }
        },
        { upsert: true }
      );
    });
  });

  describe("getAproximateUserLocation", () => {
    it("getAproximateUserLocation : retrieves approximate location based on IP", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ latitude: 12.345678, longitude: 98.765432 })
      });
      const location = await locationSvc.getAproximateUserLocation("1", mockFetch);
      expect(location).toEqual({ latitude: 12.345678, longitude: 98.765432 });
      expect(mockFetch).toHaveBeenCalledWith(`${ConstMatcha.IP_API_URL}/1/json`);
    });

    it("getAproximateUserLocation : returns null if fetch fails", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      });
      const location = await locationSvc.getAproximateUserLocation("2", mockFetch);
      expect(location).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(`${ConstMatcha.IP_API_URL}/2/json`);
    });

    it("getAproximateUserLocation : returns null if exception occurs", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
      const location = await locationSvc.getAproximateUserLocation("3", mockFetch);
      expect(location).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(`${ConstMatcha.IP_API_URL}/3/json`);
    });
  });

  describe("getNearbyUsers", () => {
    it("getNearbyUsers : retrieves nearby users correctly", async () => {
      const mockUsers = [
        {
          userId: "user1",
          username: "User One",
          distance: 500,
          latitude: 12.345678,
          longitude: 98.765432
        },
        {
          userId: "user2",
          username: "User Two",
          distance: 1000,
          latitude: 23.456789,
          longitude: 87.654321
        }
      ];
      const aggregateMock = vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockUsers)
      });
      const collectionMock = vi.fn().mockReturnValue({ aggregate: aggregateMock });
      const dbMock = { collection: collectionMock } as any;
      const getDbMock = vi.fn().mockResolvedValue(dbMock);
      const users = await locationSvc.getNearbyUsers(12.0, 98.0, 2000, getDbMock);
      expect(users).toEqual(mockUsers);
      expect(getDbMock).toHaveBeenCalled();
      expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_LOCATION);
      expect(aggregateMock).toHaveBeenCalledWith([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [98.0, 12.0]
            },
            distanceField: "distance",
            maxDistance: 2000,
            spherical: true
          }
        },
        {
          $project: {
            userId: 1,
            username: 1,
            distance: { $round: ["$distance", 2] },
            longitude: { $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 6] },
            latitude: { $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 6] }
          }
        }
      ]);
    });
  });

});
