import LoginPage from "../../pageobject/Login/LoginPage";
import { PatientConsultationPage } from "../../pageobject/Patient/PatientConsultation";
import { PatientPage } from "../../pageobject/Patient/PatientCreation";
import PatientLogupdate from "../../pageobject/Patient/PatientLogupdate";
import PatientInvestigation from "../../pageobject/Patient/PatientInvestigation";
import PatientPrescription from "../../pageobject/Patient/PatientPrescription";

describe("Patient Log Update in Normal, Critical and TeleIcu", () => {
  const loginPage = new LoginPage();
  const patientConsultationPage = new PatientConsultationPage();
  const patientPage = new PatientPage();
  const patientLogupdate = new PatientLogupdate();
  const patientInvestigation = new PatientInvestigation();
  const patientPrescription = new PatientPrescription();
  const domicilaryPatient = "Dummy Patient 11";
  const patientCategory = "Moderate";
  const additionalSymptoms = "Fever";
  const physicalExamination = "physical examination details";
  const otherExamination = "Other";
  const patientSystolic = "119";
  const patientDiastolic = "150";
  const patientModifiedSystolic = "120";
  const patientModifiedDiastolic = "145";
  const patientPulse = "152";
  const patientTemperature = "96.6";
  const patientRespiratory = "140";
  const patientSpo2 = "15";
  const patientRhythmType = "Regular";
  const patientRhythm = "Normal Rhythm";

  before(() => {
    loginPage.loginAsDisctrictAdmin();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.clearLocalStorage(/filters--.+/);
    cy.awaitUrl("/patients");
  });

  it("Create a new Progress log update for a admitted patient and edit it", () => {
    patientPage.visitPatient("Dummy Patient 12");
    patientLogupdate.clickLogupdate();
    cy.verifyNotification("Please assign a bed to the patient");
    patientLogupdate.selectBed("Dummy Bed 4");
    cy.closeNotification();
    patientLogupdate.clickLogupdate();
    // Only will be using random non-unique progress note fields
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.selectRoundType("Progress Note");
    patientLogupdate.selectSymptomsDate("01012024");
    patientLogupdate.typeAndMultiSelectSymptoms("fe", ["Fever"]);
    patientLogupdate.typeTemperature(patientTemperature);
    // add diagnosis
    patientConsultationPage.selectPatientDiagnosis(
      "1A06",
      "add-icd11-diagnosis-as-differential",
    );
    // add a investigation for the patient
    patientInvestigation.clickAddInvestigation();
    patientInvestigation.selectInvestigation("Vitals (GROUP)");
    patientInvestigation.clickInvestigationCheckbox();
    patientInvestigation.selectInvestigationFrequency("6");
    // add a medicine for the patient
    patientPrescription.clickAddPrescription();
    patientPrescription.interceptMedibase();
    patientPrescription.selectMedicinebox();
    patientPrescription.selectMedicine("DOLO");
    patientPrescription.enterDosage("4");
    patientPrescription.selectDosageFrequency("Twice daily");
    cy.submitButton("Submit");
    cy.verifyNotification("Medicine prescribed");
    cy.closeNotification();
    // Submit the doctors log update
    cy.submitButton("Save and Continue");
    cy.verifyNotification("Progress Note log created successfully");
    cy.closeNotification();
    // modify the relevant critical care log update
    cy.contains("button", "Neurological Monitoring").click();
    cy.get("#consciousness_level-option-RESPONDS_TO_PAIN").click();
    cy.get("#left_pupil_light_reaction-option-FIXED").click();
    cy.submitButton("Update Details");
    cy.verifyNotification(
      "Neurological Monitoring details succesfully updated.",
    );
    cy.closeNotification();
    // Final Submission of the form
    cy.submitButton("Complete");
    cy.verifyNotification("Progress Note Log Update filed successfully");
    cy.closeNotification();
    // Verify the data reflection
    cy.contains("button", "Daily Rounds").click();
    patientLogupdate.clickLogupdateCard("#dailyround-entry", patientCategory);
    cy.verifyContentPresence("#consultation-preview", [
      patientCategory,
      patientTemperature,
    ]);
    // verify the edit functionality
    patientLogupdate.clickUpdateDetail();
    patientLogupdate.typeSystolic(patientModifiedSystolic);
    patientLogupdate.typeDiastolic(patientModifiedDiastolic);
    cy.submitButton("Continue");
    cy.verifyNotification("Progress Note log updated successfully");
  });

  it("Create a new TeleIcu log update for a domicilary care patient", () => {
    patientPage.visitPatient("Dummy Patient 11");
    patientConsultationPage.clickEditConsultationButton();
    patientConsultationPage.selectPatientSuggestion("Domiciliary Care");
    cy.submitButton("Update Consultation");
    cy.verifyNotification("Consultation updated successfully");
    cy.closeNotification();
    patientLogupdate.clickLogupdate();
    patientLogupdate.typePhysicalExamination(physicalExamination);
    patientLogupdate.selectRoundType("Telemedicine");
    patientLogupdate.typeOtherDetails(otherExamination);
    patientLogupdate.selectSymptomsDate("01012024");
    patientLogupdate.typeAndMultiSelectSymptoms("fe", ["Fever"]);
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.typeSystolic(patientSystolic);
    patientLogupdate.typeDiastolic(patientDiastolic);
    patientLogupdate.typePulse(patientPulse);
    patientLogupdate.typeTemperature(patientTemperature);
    patientLogupdate.typeRespiratory(patientRespiratory);
    patientLogupdate.typeSpo2(patientSpo2);
    patientLogupdate.selectRhythm(patientRhythmType);
    patientLogupdate.typeRhythm(patientRhythm);
    cy.get("#consciousness_level-option-RESPONDS_TO_PAIN").click();
    cy.submitButton("Save");
    cy.verifyNotification("Telemedicine log created successfully");
  });

  it("Create a new Normal Log update for a domicilary care patient and edit it", () => {
    patientPage.visitPatient(domicilaryPatient);
    patientConsultationPage.clickEditConsultationButton();
    patientConsultationPage.selectPatientSuggestion("Domiciliary Care");
    cy.submitButton("Update Consultation");
    cy.verifyNotification("Consultation updated successfully");
    cy.closeNotification();
    patientLogupdate.clickLogupdate();
    patientLogupdate.typePhysicalExamination(physicalExamination);
    patientLogupdate.typeOtherDetails(otherExamination);
    patientLogupdate.selectSymptomsDate("01012024");
    patientLogupdate.typeAndMultiSelectSymptoms("fe", ["Fever"]);
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.typeSystolic(patientSystolic);
    patientLogupdate.typeDiastolic(patientDiastolic);
    patientLogupdate.typePulse(patientPulse);
    patientLogupdate.typeTemperature(patientTemperature);
    patientLogupdate.typeRespiratory(patientRespiratory);
    patientLogupdate.typeSpo2(patientSpo2);
    patientLogupdate.selectRhythm(patientRhythmType);
    patientLogupdate.typeRhythm(patientRhythm);
    cy.get("#consciousness_level-option-RESPONDS_TO_PAIN").click();
    cy.submitButton("Save");
    cy.verifyNotification("Brief Update log created successfully");
    cy.closeNotification();
    // edit the card and verify the data.
    cy.contains("button", "Daily Rounds").click();
    patientLogupdate.clickLogupdateCard("#dailyround-entry", patientCategory);
    cy.verifyContentPresence("#consultation-preview", [
      patientCategory,
      patientDiastolic,
      patientSystolic,
      physicalExamination,
      otherExamination,
      patientPulse,
      patientTemperature,
      patientRespiratory,
      patientSpo2,
      patientRhythm,
    ]);
    patientLogupdate.clickUpdateDetail();
    patientLogupdate.clickClearButtonInElement("#systolic");
    patientLogupdate.typeSystolic(patientModifiedSystolic);
    patientLogupdate.clickClearButtonInElement("#diastolic");
    patientLogupdate.typeDiastolic(patientModifiedDiastolic);
    cy.submitButton("Continue");
    cy.verifyNotification("Brief Update log updated successfully");
    cy.contains("button", "Daily Rounds").click();
    patientLogupdate.clickLogupdateCard("#dailyround-entry", patientCategory);
    cy.verifyContentPresence("#consultation-preview", [
      patientModifiedDiastolic,
      patientModifiedSystolic,
    ]);
  });

  it("Create a new Normal update for a admission patient and verify its reflection in cards", () => {
    patientPage.visitPatient("Dummy Patient 13");
    patientLogupdate.clickLogupdate();
    cy.verifyNotification("Please assign a bed to the patient");
    patientLogupdate.selectBed("Dummy Bed 6");
    cy.closeNotification();
    patientLogupdate.clickLogupdate();
    patientLogupdate.typePhysicalExamination(physicalExamination);
    patientLogupdate.typeOtherDetails(otherExamination);
    patientLogupdate.selectSymptomsDate("01012024");
    patientLogupdate.typeAndMultiSelectSymptoms("fe", ["Fever"]);
    patientLogupdate.clickAddSymptom();
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.typeSystolic(patientSystolic);
    patientLogupdate.typeDiastolic(patientDiastolic);
    patientLogupdate.typePulse(patientPulse);
    patientLogupdate.typeTemperature(patientTemperature);
    patientLogupdate.typeRespiratory(patientRespiratory);
    patientLogupdate.typeSpo2(patientSpo2);
    patientLogupdate.selectRhythm(patientRhythmType);
    patientLogupdate.typeRhythm(patientRhythm);
    cy.get("#consciousness_level-option-RESPONDS_TO_PAIN").click();
    cy.submitButton("Save");
    cy.wait(2000);
    cy.verifyNotification("Brief Update log created successfully");
    // Verify the card content
    cy.get("#basic-information").scrollIntoView();
    cy.verifyContentPresence("#encounter-symptoms", [additionalSymptoms]);
  });

  it("Create a Normal Log update to verify MEWS Score Functionality", () => {
    patientPage.visitPatient(domicilaryPatient);
    patientConsultationPage.clickEditConsultationButton();
    patientConsultationPage.selectPatientSuggestion("Domiciliary Care");
    cy.submitButton("Update Consultation");
    cy.verifyNotification("Consultation updated successfully");
    cy.closeNotification();
    patientLogupdate.clickLogupdate();
    // Verify the MEWS Score reflection
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.typeSystolic(patientSystolic);
    patientLogupdate.typeDiastolic(patientDiastolic);
    patientLogupdate.typePulse(patientPulse);
    patientLogupdate.typeTemperature(patientTemperature);
    patientLogupdate.typeRespiratory(patientRespiratory);
    cy.get("#consciousness_level-option-RESPONDS_TO_PAIN").click();
    cy.submitButton("Save");
    cy.verifyNotification("Brief Update log created successfully");
    cy.closeNotification();
    cy.verifyContentPresence("#consultation-buttons", ["9"]);
    // Verify the Incomplete data will give blank info
    patientLogupdate.clickLogupdate();
    patientLogupdate.selectPatientCategory(patientCategory);
    patientLogupdate.typeSystolic(patientSystolic);
    patientLogupdate.typeDiastolic(patientDiastolic);
    patientLogupdate.typePulse(patientPulse);
    cy.submitButton("Save");
    cy.verifyNotification("Brief Update log created successfully");
    cy.closeNotification();
    cy.verifyContentPresence("#consultation-buttons", ["-"]);
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
});
