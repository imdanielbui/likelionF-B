import IDrink from "./idrink.js";

export default class DrinkSevice {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  private isDrinkArray(data: unknown): data is IDrink[] {
    if (!Array.isArray(data)) return false;
    return data.every((item) => typeof item === "object" && "id" in item && "category" in item && "name" in item && "description" in item && "size" in item && "price" in item);
  }
  private isDirnk(data: unknown): data is IDrink {
    return data !== null && typeof data === "object" && "id" in data && "category" in data && "name" in data && "description" in data && "size" in data && "price" in data;
  }
  async getDrinks(): Promise<IDrink[]> {
    try {
      const response = await fetch(`${this.baseUrl}/drinks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!this.isDrinkArray(data)) {
        throw new Error("Invalid data format received");
      }
      return data;
    } catch (error) {
      console.error("fetch drinks?", error);
      return [];
    }
  }

  async getDrinkById(id: string): Promise<IDrink> {
    try {
      const response = await fetch(`${this.baseUrl}/drinks/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!this.isDirnk(data)) {
        throw new Error("Invalid data format received");
      }

      return data;
    } catch (error) {
      console.error("fetch drink id", error);

      return {} as IDrink;
    }
  }
}
