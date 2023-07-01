import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../persistence/prisma/prisma.paginator';

export type SelectPostQueryParameters = {
  page?: number;
  limit?: number;
};

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async getPosts({
    where,
    orderBy,
    page,
    limit,
  }: {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Post>> {
    const paginate: PaginateFunction = paginator({
      page: page,
      perPage: limit,
    });
    return paginate(
      this.prisma.post,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
