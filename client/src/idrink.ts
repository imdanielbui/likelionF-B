export default interface IDrink {
  id: string;
  category: string;
  name: string;
  description: string;
  size: string[];
  price: {
    [key: string]: number;
  };
}
