const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env['SENDGRID_API_KEY']);
const { User } = require('../../config/sequelize')
class emailController {

  sendEmail(req, res) {
    let studentIds = [];
    let studentNames = [];
    let studentEmails = [];
    let studentIdsJson = JSON.parse(req.body.studentIds);
    let studentNamesJson = JSON.parse(req.body.studentNames);
    let studentEmailsJson = JSON.parse(req.body.studentEmails);
    for (var i = 0; i < studentIdsJson.length; i++) {
      studentIds.push(studentIdsJson[`${i}`])
      studentNames.push(studentNamesJson[`${i}`])
      studentEmails.push(studentEmailsJson[`${i}`])
    }
    let { tutorId } = req.body
    User.findOne({
      where: { id: tutorId }
    }).then(tutor => {
      const personalizations = [];
      for (var i = 0; i < studentIds.length; i++) {
        personalizations.push({
          to: studentEmails[i],
          dynamic_template_data: {
            student: studentNames[i],
            classLink: `http://localhost:3000/class/${studentIds[i]}/stream`
          }
        })
      }
      const msg = {
        from: 'no-reply@em1074.etutorgreenwich.cloudns.asia',
        templateId: 'd-0cb58db4b36b4ca8a5e102fd59d97bb7',
        subject: "Greenwich Etutor Notification",
        dynamic_template_data: {
          tutor: tutor.dataValues.fullname
        },
        personalizations: personalizations
      };

      var studentEmailResult;
      sgMail
        .sendMultiple(msg)
        .then((result) => { studentEmailResult = result }, error => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body)
          }
        });

      var tutorEmailResult = [];
      for (var i = 0; i < studentIds.length; i++) {
        const msgTutor = {
          from: 'no-reply@em1074.etutorgreenwich.cloudns.asia',
          templateId: 'd-ee64da6e824546e9a6ce2e4bc64d068f',
          subject: 'Greenwich Etutor Notification',
          to: tutor.dataValues.email,
          dynamic_template_data: {
            tutor: tutor.dataValues.fullname,
            student: studentNames[i],
            classLink: `http://localhost:3000/`
          }
        }
        sgMail
          .send(msgTutor)
          .then((result) => { tutorEmailResult.push(result) }, error => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
          })
      }
      res.send({ studentEmailResult: studentEmailResult, tutorEmailResult: tutorEmailResult })
    })

  }
}
module.exports = new emailController()