# L2 Healthcare Extension / L2 医疗健康行业扩展

L2 Healthcare Industry and Domain Extension — 28 classes, 10 relations (v1.0.0).

L2 医疗健康行业扩展 —— 包含 28 个类、10 个关系（v1.0.0）。

> Source: [`l2-extensions/healthcare/healthcare_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/healthcare/healthcare_extension_v1.json)


---


## Classes / 类 (28)


| ID | EN | ZH | Parent | Definition (EN) |
|:---|:---|:---|:---|:---|
| `HealthcareProvider` | Healthcare Provider | 医疗服务提供者 | `Organization` | An institution providing healthcare services, including hospitals, clinics, nursing homes, and third-party labs |
| `Hospital` | Hospital | 医院 | `HealthcareProvider` | A general or specialized medical institution with inpatient capabilities |
| `ClinicalDepartment` | Clinical Department | 临床科室 | `OrgUnit` | A department organized by medical specialty, e.g., cardiology, orthopedics, oncology |
| `PharmaceuticalCompany` | Pharmaceutical Company | 制药企业 | `Organization` | An enterprise engaged in drug R&D, manufacturing, and commercialization |
| `DrugProduct` | Drug Product | 药品 | `ProductService` | A registered therapeutic or prophylactic pharmaceutical product |
| `MedicalDevice` | Medical Device | 医疗器械 | `ProductService` | Instruments, equipment, and consumables used for diagnosis, treatment, or monitoring |
| `ClinicalTrial` | Clinical Trial | 临床试验 | `Resource` | A systematic study to evaluate safety and efficacy of drugs or devices in human subjects |
| `Patient` | Patient | 患者 | `Role` | An individual role receiving healthcare services |
| `Physician` | Physician | 医师 | `Role` | A licensed medical practitioner providing diagnosis and treatment |
| `Nurse` | Nurse | 护士 | `Role` | A clinical role providing nursing care and patient support |
| `ClinicalResearcher` | Clinical Researcher | 临床研究员 | `Role` | A research role designing and conducting clinical trials |
| `Diagnosis` | Diagnosis | 诊断 | `DataObject` | Disease determination based on symptoms, examinations, and lab results |
| `Prescription` | Prescription | 处方 | `Document` | Medication instructions issued by a physician for a patient |
| `ElectronicHealthRecord` | Electronic Health Record | 电子健康档案 | `Document` | Digitized systematic record of patient care including history, exams, medications, and procedures |
| `ClinicalProtocol` | Clinical Protocol | 临床方案 | `Document` | Standard document defining clinical trial design, execution, and data collection |
| `RegulatorySubmission` | Regulatory Submission | 注册申报 | `Document` | Application materials submitted to drug or device regulatory authorities for approval |
| `PatientSafetyRisk` | Patient Safety Risk | 患者安全风险 | `Risk` | Risk of patient harm due to medical errors, infection control failures, or adverse drug reactions |
| `DataPrivacyRisk` | Data Privacy Risk | 数据隐私风险 | `Risk` | Privacy compliance risk from health data breaches or inappropriate use of patient data |
| `GMPPolicy` | Good Manufacturing Practice Policy | GMP 政策 | `Policy` | Quality management standards for pharmaceutical manufacturing ensuring drug safety, efficacy, and quality |
| `HIPAAPolicy` | Health Data Protection Policy | 健康数据保护政策 | `Policy` | Compliance policy protecting patient health information privacy and security (e.g., HIPAA, GDPR health provisions) |
| `ClinicalCareProcess` | Clinical Care Process | 临床诊疗流程 | `Process` | End-to-end care process from registration, consultation, examination, diagnosis to treatment |
| `DrugDevelopmentProcess` | Drug Development Process | 药物研发流程 | `Process` | Full pipeline from target discovery, preclinical, clinical trials to NDA submission |
| `ClinicalInformaticsCapability` | Clinical Informatics Capability | 临床信息化能力 | `Capability` | Capability to leverage IT for clinical decision support, medical records, and patient communication |
| `HISSystem` | Hospital Information System | 医院信息系统 | `SystemApplication` | Integrated information system managing hospital administrative, clinical, and financial operations |
| `LISSystem` | Laboratory Information System | 实验室信息系统 | `SystemApplication` | Information system managing lab sample processing, result recording, and reporting |
| `BedOccupancyRate` | Bed Occupancy Rate | 床位使用率 | `KPI` | Ratio of occupied beds to total available beds |
| `ReadmissionRate` | Readmission Rate | 再入院率 | `KPI` | Rate of unplanned readmissions within a defined period after discharge |
| `ClinicalTrialSuccessRate` | Clinical Trial Success Rate | 临床试验成功率 | `KPI` | Rate of clinical trials meeting primary endpoints, tracked by phase (I/II/III) |

## Relations / 关系 (10)


| ID | Domain | Range | Definition (EN) |
|:---|:---|:---|:---|
| `has_department` | `Hospital` | `ClinicalDepartment` | A hospital has clinical departments |
| `treats_patient` | `Physician` | `Patient` | A physician treats a patient |
| `prescribes` | `Physician` | `Prescription` | A physician issues a prescription |
| `documents_in_ehr` | `Diagnosis` | `ElectronicHealthRecord` | A diagnosis is documented in the electronic health record |
| `conducted_under_protocol` | `ClinicalTrial` | `ClinicalProtocol` | A clinical trial is conducted under a clinical protocol |
| `develops_drug` | `PharmaceuticalCompany` | `DrugProduct` | A pharmaceutical company develops a drug product |
| `submitted_for_approval` | `DrugProduct` | `RegulatorySubmission` | A drug product is submitted for regulatory approval |
| `managed_in_his` | `ElectronicHealthRecord` | `HISSystem` | Electronic health records are managed in the HIS |
| `tested_in_lis` | `Diagnosis` | `LISSystem` | Lab results are recorded in the LIS |
| `complies_with_gmp` | `DrugProduct` | `GMPPolicy` | Drug manufacturing complies with GMP policy |
