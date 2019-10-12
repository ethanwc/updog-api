import { IsString } from "class-validator";

class CreateCommentDto {
  @IsString()
  public comment: string;
  @IsString()
  public email: string;
}
export default CreateCommentDto;
