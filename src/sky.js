const puppeteer = require('puppeteer')

/**
 * Realiza el proceso de checkin en sky con todo por defecto.
 *
 * Lo anterior quiere decir que la seleccion del asiento es aleatoria y NO se
 * seleccionan adicionales.
 * La confirmación del checkin es enviada al correo electronico registrado en
 * la compra.
 *
 * @param {string} code - Codigo de vuelo.
 * @param {string} lastName - Apellido del pasajero.
 * @param {string} rut - RUT del pasajero.
 * @param {string} birthday - Fecha de nacimiento del pasajero.
 * @param {string} expireDate - Fecha de expiracion del documento del pasajero.
 * @returns {Promise<void>} - Proceso finalizado.
 * @example
 * await checkIn('ABCDEF', 'xxxxxx', '11111111-1', 'DD/MM/YYYY', 'DD/MM/YYYY')
 */
const checkIn = async (code, lastName, rut, birthday, expireDate) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await page.goto('https://www.skyairline.com/chile/administra/buscar')

  await page.setViewport({ width: 1042, height: 630 })

  await page.waitForSelector('#form0 #PNR')
  await page.type('#form0 #PNR', code)

  await page.waitForSelector('#form0 #lastName')
  await page.type('#form0 #lastName', lastName)

  await page.waitForSelector('.login-form > #form0 #continueButton')
  await page.click('.login-form > #form0 #continueButton')
  await navigationPromise

  await page.waitForSelector(
    'form > .row > .col-md-2 > .global-checkin > .custom_submit'
  )
  await page.click('form > .row > .col-md-2 > .global-checkin > .custom_submit')
  await navigationPromise

  await page.waitForSelector(
    '.row > .col-md-4 > .global-checkin > .checked-in-wrapper > .custom_submit'
  )
  await page.click(
    '.row > .col-md-4 > .global-checkin > .checked-in-wrapper > .custom_submit'
  )
  await navigationPromise

  await page.waitForSelector('.col-md-12 > #servicesForm #btnSubmitForm')
  await page.click('.col-md-12 > #servicesForm #btnSubmitForm')
  await navigationPromise

  await page.waitForSelector('.passenger #apisInfoBirthday0')
  await page.type('.passenger #apisInfoBirthday0', birthday)

  await page.waitForSelector('.col-md-4 #Profile_DocumentId')
  await page.select('.col-md-4 #Profile_DocumentId', '')

  await page.waitForSelector('.row #apisInfoSSN0')
  await page.type('.row #apisInfoSSN0', rut)

  await page.waitForSelector(
    'div > .passenger > .row > .col-md-2 > .common-dropdown'
  )
  await page.click('div > .passenger > .row > .col-md-2 > .common-dropdown')

  await page.waitForSelector(
    '.passenger > .row > .col-md-2 > .common-dropdown > select'
  )
  await page.select(
    '.passenger > .row > .col-md-2 > .common-dropdown > select',
    'M'
  )

  await page.waitForSelector(
    '.passenger > .row > .col-md-3:nth-child(2) > .common-dropdown > select'
  )
  await page.select(
    '.passenger > .row > .col-md-3:nth-child(2) > .common-dropdown > select',
    '152'
  )

  await page.waitForSelector(
    '.passenger > .row > .col-md-3:nth-child(3) > .common-dropdown > select'
  )
  await page.select(
    '.passenger > .row > .col-md-3:nth-child(3) > .common-dropdown > select',
    '152'
  )

  await page.waitForSelector('.passenger #expireDate0')
  await page.type('.passenger #expireDate0', expireDate)

  await page.waitForSelector('#checkinPaymentForm #paymentSubmitButton')
  await page.click('#checkinPaymentForm #paymentSubmitButton')
  await navigationPromise

  await page.waitForSelector('.confirmation-leg #btnSendEmail')
  await page.click('.confirmation-leg #btnSendEmail')

  await browser.close()
}

module.exports = checkIn
