import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';
import { Post as PostModel} from '@prisma/client';
import { CreatePostDto } from './post.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}
  @Get('/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('/feed')
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

  @Put('publish/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('/:id')
  @ApiTags('Posts') // Add API tags for the endpoint
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
