import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { subjectService } from '../../_services';
import { showSuccessMessage, showErrorMessage } from '../../_helpers/messages'
import { ifError } from 'assert';


export default function SubjectCreate() {
  const { pathname } = useLocation();
  const isAddMode = !pathname.includes('edit');
  const params = useParams();
  const id = params.sub;
  // const { id } = match.params;
  // const isAddMode = !id;

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Subject name is required'),
    creditHour: Yup.number().required('Credit hour must be number'),
    lecture: Yup.number().required('Lecture must be number'),
    practical: Yup.number().required('Practical must be number'),
    alias: Yup.number().required('Alias must be number'),
  });

  // functions to build form returned by useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit(data) {
    return isAddMode ? createSubject(data) : updateSubject(id, data);
  }

  function createSubject(data) {
    return subjectService
      .create(data)
      .then(() => {
        reset()
        showSuccessMessage("Subject added successfully");
      })
      .catch((err) => {
        console.log(err);
        showErrorMessage("something went wrong. try again")
      });
  }

  function updateSubject(id, data) {
    console.log(id,data)
    return subjectService
      .update(id, data)
      .then(() => {
        reset()
        showSuccessMessage("Subject updated successfully");
        // alertService.success('User updated', { keepAfterRouteChange: true });
      })
      .catch(() => {
        showErrorMessage("something went wrong. try again")
      });
  }

  useEffect(() => {
    if (!isAddMode) {
      // get user and set form fields
      subjectService.getById(id).then((dept) => {
        // console.log(dept)
        const fields = ['name','creditHour', 'lecture','practical','alias'];
        fields.forEach((field) => setValue(field, dept[field]));
      });
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode ? 'Add Subject' : 'Edit Subject'}</h1>
        <div className="form-row">
          <div className="form-group col-7">
            <label>Subject</label>
            <input
              name="name"
              type="text"
              {...register('name')}
              // className={`form-control`}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors?.name?.message}</div>
          </div>
          <div className="form-group col-7">
            <label>Credit Hour</label>
            <input
              name="creditHour"
              type="number"
              {...register('creditHour')}
              // className={`form-control`}
              className={`form-control ${errors.creditHour ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors?.creditHour?.message}</div>
          </div>
          <div className="form-group col-7">
            <label>Lecture</label>
            <input
              name="lecture"
              type="number"
              {...register('lecture')}
              // className={`form-control`}
              className={`form-control ${errors.lecture ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors?.lecture?.message}</div>
          </div>
          <div className="form-group col-7">
            <label>Practical</label>
            <input
              name="practical"
              type="number"
              {...register('practical')}
              // className={`form-control`}
              className={`form-control ${errors.practical ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors?.practical?.message}</div>
          </div>
          <div className="form-group col-7">
            <label>Alias</label>
            <input
              name="alias"
              type="number"
              {...register('alias')}
              // className={`form-control`}
              className={`form-control ${errors.alias ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors?.alias?.message}</div>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
            Save
          </button>
          <Link to={'/dashboard/subject'} className="btn btn-link">
            Go back
          </Link>
        </div>
      </form>
    </>
  );
}
