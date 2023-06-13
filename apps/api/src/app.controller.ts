import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './users/users.service';
import { PostService } from './post/post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';

class CreatePostDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content?: string;
  @ApiProperty()
  authorEmail: string;
}

class CreateUserDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  email: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('post/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  @ApiTags('Posts') // Add API tags for the endpoint
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  @ApiTags('Posts') // Add API tags for the endpoint
  async getFilteredPosts(@Param('searchString') searchString: string): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  @ApiTags('Posts') // Add API tags for the endpoint
  @ApiBody({ type: () => CreatePostDto }) // Add request body parameter for Swagger documentation
  async createDraft(@Body() postData: CreatePostDto): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  @ApiTags('Users') // Add API tags for the endpoint
  @ApiBody({ type: () => CreateUserDto }) // Add request body parameter for Swagger documentation
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('publish/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
