import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { ProductDto } from '../../../module/product/dto/product.dto';
import { CartException } from '../exception/cart.exception';
import { HttpStatus } from '@nestjs/common';

interface ProductServiceInterfaceStub {
  findBySlugAndInternalCode: jest.Mock;
}

class ProductServiceStub implements ProductServiceInterfaceStub {
  findBySlugAndInternalCode = jest.fn();
}

const cartModelMock = {
  create: jest.fn(),
};

const createCartDto = {
  items: [
    {
      slug: 'product-123',
      gsic: '123',
      quantity: 2,
    },
    {
      slug: 'product-456',
      gsic: '456',
      quantity: 3,
    },
  ],
};

const productsMock = [
  {
    name: 'Product 123',
    description: 'Product description',
    slug: 'product-123',
    gsic: '123',
    price: 100,
    stock: 10,
    category: 'Category',
  },
  {
    name: 'Product 456',
    description: 'Product description 456',
    slug: 'product-456',
    gsic: '456',
    price: 200,
    stock: 5,
    category: 'Category B',
  },
];

const productServiceMock = {
  findBySlugAndInternalCode: jest.fn((slug, gsic) => {
    return Promise.resolve(
      productsMock.find(
        (product) => product.slug === slug && product.gsic === gsic,
      ) as ProductDto,
    );
  }),
};

const cartMock = {
  sessionId: 'mock-session-id',
  gsic: 'mock-gsic',
  items: [
    {
      gsic: '123',
      name: 'Product 123',
      price: 100,
      quantity: 2,
      subtotal: 200,
    },
    {
      gsic: '456',
      name: 'Product 456',
      price: 200,
      quantity: 3,
      subtotal: 600,
    },
  ],
  totalItems: 5,
  totalPrice: 800,
  status: 'active',
};

describe('CartService', () => {
  let service: CartService;
  let productService: ProductServiceStub;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: 'ProductService', useValue: productServiceMock },
        { provide: 'CartModel', useValue: cartModelMock },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    productService = module.get<ProductServiceStub>('ProductService');
  });

  it('should throw an error if product stock is insufficient', async () => {
    jest
      .spyOn(productServiceMock, 'findBySlugAndInternalCode')
      .mockImplementation((slug, gsic) => {
        const product = productsMock.find(
          (product) => product.slug === slug && product.gsic === gsic,
        );

        return Promise.resolve({ ...product, stock: 1 } as ProductDto);
      });

    await expect(
      service.create({
        items: [
          {
            slug: 'product-123',
            gsic: '123',
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow(
      new CartException(
        'Produto Product 123 sem estoque suficiente',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should create a cart successfully', async () => {
    jest
      .spyOn(productServiceMock, 'findBySlugAndInternalCode')
      .mockImplementation((slug, gsic) => {
        const product = productsMock.find(
          (product) => product.slug === slug && product.gsic === gsic,
        );

        return Promise.resolve(product as ProductDto);
      });

    cartModelMock.create.mockResolvedValue({
      ...cartMock,
      save: jest.fn().mockResolvedValue(cartMock),
    });

    const result = await service.create(createCartDto);

    expect(cartModelMock.create).toHaveBeenCalledWith({
      sessionId: expect.any(String),
      gsic: expect.any(String),
      items: cartMock.items,
      totalItems: cartMock.totalItems,
      totalPrice: cartMock.totalPrice,
      status: cartMock.status,
    });

    expect(result).toEqual(cartMock);
  });
});
