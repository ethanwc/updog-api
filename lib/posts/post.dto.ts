import { IsString, IsArray } from "class-validator";

/**
 * Post json data type for type checking.
 */
class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;

  // @IsArray()
  // public comments: Array<>;
}

export default CreatePostDto;
