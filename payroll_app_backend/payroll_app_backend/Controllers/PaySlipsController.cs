using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using payroll_app_backend.Models;

namespace payroll_app_backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PaySlipsController : ApiController
    {

        private PaySlipModel db = new PaySlipModel();

        // GET: api/PaySlips
        public IQueryable<PaySlip> GetPaySlips()
        {
            return db.PaySlips;
        }

        // GET: api/PaySlips/5
        [ResponseType(typeof(PaySlip))]
        public IHttpActionResult GetPaySlip(int id)
        {
            PaySlip paySlip = db.PaySlips.Find(id);
            if (paySlip == null)
            {
                return NotFound();
            }

            return Ok(paySlip);
        }

        // PUT: api/PaySlips/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPaySlip(int id, PaySlip paySlip)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != paySlip.Id)
            {
                return BadRequest();
            }

            db.Entry(paySlip).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaySlipExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PaySlips
        [ResponseType(typeof(PaySlip))]
        public IHttpActionResult PostPaySlip(PaySlip paySlip)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PaySlips.Add(paySlip);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = paySlip.Id }, paySlip);
        }

        // DELETE: api/PaySlips/5
        [ResponseType(typeof(PaySlip))]
        public IHttpActionResult DeletePaySlip(int id)
        {
            PaySlip paySlip = db.PaySlips.Find(id);
            if (paySlip == null)
            {
                return NotFound();
            }

            db.PaySlips.Remove(paySlip);
            db.SaveChanges();

            return Ok(paySlip);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PaySlipExists(int id)
        {
            return db.PaySlips.Count(e => e.Id == id) > 0;
        }
    }
}