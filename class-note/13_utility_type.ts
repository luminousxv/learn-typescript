interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// 1. 상품 목록을 받아오기 위한 API 함수
// function fetchProducts(): Promise<Product[]> {
//   //..
// }

// interface ProductDetail{
//   id: number;
//   name: string;
//   price: number;
// }

// 2. 특정 상품의 상세 정보를 나타내기 위한 함수
type ShoppingItem = Pick<Product, 'id' | 'name' | 'price'>;
function displayProductDetail(productItem: ShoppingItem) {

}

// 3. 특정 상품 정보를 업데이트(갱신)하는 함수
type UpdateProduct = Partial<Product>;
function upbdateProductItem(productItem: UpdateProduct) {}

// 4. 유틸리티 타입 구현하기 - Partial
interface UserProfile {
  username: string;
  email: string;
  profilePhotoUrl: string;
}
// interface UserProfileUpdate {
//   userName?: string;
//   email?: string;
//   profilePhotoUrl?: string;
// }
// #1
type UserProfileUpdate1 = {
  username?: UserProfile['username'];
  email?: UserProfile['email'];
  profilePhotoUrl?: UserProfile['profilePhotoUrl'];
};

// #2
type UserProfileUpdate2 = {
  [p in 'username' | 'email' | 'profilePhotoUrl']?: UserProfile[p];
}
type UserProfileKeys = keyof UserProfile;

// #3
type UserProfileUpdate3 = {
  [p in keyof UserProfile]?: UserProfile[p];
}

// #4
type Subset<T> = {  //Partial Type
  [p in keyof T]?: T[p];
};
