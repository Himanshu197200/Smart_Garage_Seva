import Joi from 'joi';
import { JobStatus } from '../patterns/state/JobState';

export interface UpdateJobStatusDTO {
  status: JobStatus;
}

export const updateJobStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(JobStatus)).required()
});
