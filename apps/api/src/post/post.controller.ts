import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Post as PostModel } from '@prisma/client';
import { CreatePostDto } from './post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Headers } from '@nestjs/common';
import { SelectPostQueryParameters } from './post.service';
import { PaginatedResult } from '../persistence/prisma/prisma.paginator';
import { AuthService } from 'src/auth/auth.service';

@Controller('posts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(PostController.name);

  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('/')
  async getPublishedPosts(
    @Headers() queryParameters: SelectPostQueryParameters,
  ): Promise<PaginatedResult<PostModel>> {
    const posts = await this.postService.getPosts({
      where: { published: false },
      limit: queryParameters.limit,
      page: queryParameters.page,
    });
    this.logger.log(`Retrieved ${posts.data.length} posts`);
    return posts;
  }

  @Post('/')
  @ApiBody({ type: () => CreatePostDto })
  async createPost(
    @Body() postData: CreatePostDto,
    @Headers() headers,
  ): Promise<PostModel> {
    const { title, content } = postData;
    const token = headers['authorization'].split(' ')[1];
    const currentUser = await this.authService.getUserData(token);

    this.logger.log(`${currentUser.username} created new post`);
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: currentUser.email },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
