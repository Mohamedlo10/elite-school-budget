import prisma from '../prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category-types';

export async function create(createCategoryDto: CreateCategoryDto) {
  return prisma.category.create({
    data: createCategoryDto,
  });
}

export async function findAll() {
  return prisma.category.findMany();
}

export async function findOne(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error(`Category with ID ${id} not found`);
  }

  return category;
}

export async function update(id: string, updateCategoryDto: UpdateCategoryDto) {
  try {
    return await prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  } catch (error) {
    throw new Error(`Category with ID ${id} not found`);
  }
}

export async function remove(id: string) {
  try {
    return await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Category with ID ${id} not found`);
  }
} 