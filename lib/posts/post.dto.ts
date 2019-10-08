import { IsString } from "class-validator";

/**
 * Post json data type for type checking.
 */
class CreatePostDto {
  @IsString()
  public author: string;

  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreatePostDto;
