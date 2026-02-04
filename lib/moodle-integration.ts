// Crear este nuevo archivo para la integración con Moodle

import puppeteer from "puppeteer"

type MoodleUserData = {
  username: string
  password: string
  email: string
  firstname: string
  lastname: string
  course?: string // ID del curso opcional para inscripción automática
}

export async function registerUserInMoodle(userData: MoodleUserData): Promise<{ success: boolean; message: string }> {
  let browser
  try {
    // Iniciar navegador headless
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necesario para entornos serverless
    })

    const page = await browser.newPage()

    // Configurar timeout más largo para entornos de producción
    page.setDefaultNavigationTimeout(60000)

    // Navegar a la página de registro de Moodle
    await page.goto(process.env.MOODLE_URL + "/login/signup.php")

    // Llenar el formulario de registro
    await page.type("#id_username", userData.username)
    await page.type("#id_password", userData.password)
    await page.type("#id_email", userData.email)
    await page.type("#id_firstname", userData.firstname)
    await page.type("#id_lastname", userData.lastname)

    // Aceptar términos y condiciones si es necesario
    const termsCheckbox = await page.$("#id_policyagreed")
    if (termsCheckbox) {
      await termsCheckbox.click()
    }

    // Enviar formulario
    await page.click("#id_submitbutton")

    // Esperar a que se complete el registro
    await page.waitForNavigation({ waitUntil: "networkidle0" })

    // Verificar si el registro fue exitoso
    const errorElement = await page.$(".alert-danger")
    if (errorElement) {
      const errorText = await page.evaluate((el) => el.textContent, errorElement)
      throw new Error(`Error en registro Moodle: ${errorText}`)
    }

    // Si se especificó un curso, inscribir al usuario
    if (userData.course) {
      await page.goto(`${process.env.MOODLE_URL}/course/view.php?id=${userData.course}`)
      // Lógica para inscripción en curso
    }

    return { success: true, message: "Usuario registrado correctamente en Moodle" }
  } catch (error) {
    console.error("Error en registro Moodle:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido en registro Moodle",
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
