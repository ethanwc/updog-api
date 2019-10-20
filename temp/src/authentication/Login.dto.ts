import { IsString } from "class-validator";

/**
 * Checks type of login json object.
 */
class LogInDto {
  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default LogInDto;
