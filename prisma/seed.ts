import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding (preservation mode)...");

  try {
    // NO CLEARING - We preserve existing data
    console.log("🛡️ Preserving existing data - adding new records only");

    // Create 1 branch in existing organization (686eade4a046df82f2d79fc5)
    const existingOrgId = "686eade4a046df82f2d79fc5";

    const newBranch = await prisma.branch.create({
      data: {
        name: "Development Branch",
        city: "New York",
        state: "New York",
        organizationId: existingOrgId,
        createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt", // Admin user
      },
    });

    console.log("🏢 Created 1 branch in existing organization");

    // Create 1 department in the new branch
    const newDepartment = await prisma.department.create({
      data: {
        name: "Software Development",
        branchId: newBranch.id,
        organiationId: existingOrgId,
      },
    });

    console.log("🏭 Created 1 department in the new branch");

    // Update admin and user to assign them to the new branch and department
    await prisma.user.updateMany({
      where: {
        userId: {
          in: [
            "user_2zYIPHQYlQc8QSg729EyzjbItrt",
            "user_2zcj4Qbe6M9xVXm9IxcrI1dDOt9",
          ],
        },
      },
      data: {
        branchId: newBranch.id,
        deparmentId: newDepartment.id,
      },
    });

    console.log("👥 Assigned admin and user to new branch and department");

    // Create 10 new organizations (all pending, without branches/departments)
    const newOrganizations = await Promise.all([
      prisma.organization.create({
        data: {
          name: "InnovateTech Solutions",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1001",
          orgEmail: "contact@innovatetech.com",
          organizationSize: "10-20",
          knowledgeBase:
            "InnovateTech Solutions specializes in cutting-edge software development and AI integration for small to medium businesses.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "GlobalCare Health",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1002",
          orgEmail: "info@globalcare.com",
          organizationSize: "100-500",
          knowledgeBase:
            "GlobalCare Health provides comprehensive healthcare management solutions with a focus on patient-centered care and digital health innovations.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "EcoSustain Industries",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1003",
          orgEmail: "hello@ecosustain.com",
          organizationSize: "50-100",
          knowledgeBase:
            "EcoSustain Industries develops sustainable technology solutions for environmental conservation and green energy initiatives.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "FinSecure Banking",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1004",
          orgEmail: "support@finsecure.com",
          organizationSize: "500-1000",
          knowledgeBase:
            "FinSecure Banking offers secure digital banking solutions with advanced fraud detection and cryptocurrency integration.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "EduFuture Academy",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1005",
          orgEmail: "contact@edufuture.com",
          organizationSize: "20-50",
          knowledgeBase:
            "EduFuture Academy delivers next-generation online education platforms with AI-powered personalized learning experiences.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "RetailMax Commerce",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1006",
          orgEmail: "team@retailmax.com",
          organizationSize: "100-500",
          knowledgeBase:
            "RetailMax Commerce provides omnichannel retail solutions with advanced inventory management and customer analytics.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "CloudOps Infrastructure",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1007",
          orgEmail: "ops@cloudops.com",
          organizationSize: "50-100",
          knowledgeBase:
            "CloudOps Infrastructure specializes in cloud migration, DevOps automation, and scalable infrastructure solutions.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "MediaStream Entertainment",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1008",
          orgEmail: "info@mediastream.com",
          organizationSize: "100-500",
          knowledgeBase:
            "MediaStream Entertainment creates innovative digital content platforms with AI-driven recommendation systems.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "AgriTech Innovations",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1009",
          orgEmail: "hello@agritech.com",
          organizationSize: "20-50",
          knowledgeBase:
            "AgriTech Innovations develops smart farming solutions using IoT sensors and machine learning for precision agriculture.",
          isPending: true,
        },
      }),
      prisma.organization.create({
        data: {
          name: "SecureNet Cybersecurity",
          createdBy: "user_2zYIPHQYlQc8QSg729EyzjbItrt",
          contactsNumber: "+1-555-1010",
          orgEmail: "security@securenet.com",
          organizationSize: "50-100",
          knowledgeBase:
            "SecureNet Cybersecurity provides enterprise-grade security solutions including threat detection, vulnerability assessment, and incident response.",
          isPending: true,
        },
      }),
    ]);

    console.log("🏢 Created 10 new organizations (all pending)");

    // Create Company Articles for the existing organization
    const companyArticles = await Promise.all([
      prisma.companyArticles.create({
        data: {
          name: "Employee Handbook",
          organizationId: existingOrgId,
        },
      }),
      prisma.companyArticles.create({
        data: {
          name: "Technical Standards",
          organizationId: existingOrgId,
        },
      }),
      prisma.companyArticles.create({
        data: {
          name: "Security Policies",
          organizationId: existingOrgId,
        },
      }),
    ]);

    // Create Articles for each category
    const articles = await Promise.all([
      // Employee Handbook articles
      prisma.article.create({
        data: {
          title: "Employee Code of Conduct",
          pdfUrl: "/Employee Code of Conduct.pdf",
          companyArticlesId: companyArticles[0].id,
        },
      }),
      prisma.article.create({
        data: {
          title: "Benefits and Compensation Guide",
          pdfUrl: "/Benefits Policy.pdf",
          companyArticlesId: companyArticles[0].id,
        },
      }),
      prisma.article.create({
        data: {
          title: "Leave and Vacation Policy",
          pdfUrl: "/Standard Leave Policy.pdf",
          companyArticlesId: companyArticles[0].id,
        },
      }),
      // Technical Standards articles
      prisma.article.create({
        data: {
          title: "API Development Guidelines",
          pdfUrl: "/api-development-guide.pdf",
          companyArticlesId: companyArticles[1].id,
        },
      }),
      prisma.article.create({
        data: {
          title: "Code Review Standards",
          pdfUrl: "/code-review-standards.pdf",
          companyArticlesId: companyArticles[1].id,
        },
      }),
      // Security Policies articles
      prisma.article.create({
        data: {
          title: "Password and Authentication Policy",
          pdfUrl: "/Password Policy.pdf",
          companyArticlesId: companyArticles[2].id,
        },
      }),
      prisma.article.create({
        data: {
          title: "Data Privacy and Protection",
          pdfUrl: "/Employee Data Privacy Policy.pdf",
          companyArticlesId: companyArticles[2].id,
        },
      }),
    ]);

    console.log(
      "📚 Created 3 company article categories and 7 articles for existing organization"
    );

    console.log("✅ Database seeding completed successfully!");
    console.log("\n� Summary:");
    console.log(
      `- New Organizations: ${newOrganizations.length} (all pending)`
    );
    console.log(`- New Branch: 1 (in existing organization)`);
    console.log(`- New Department: 1 (in new branch)`);
    console.log(
      `- Company Articles: ${companyArticles.length} (in existing organization)`
    );
    console.log(`- Articles: ${articles.length} (in existing organization)`);
    console.log(`- Updated users: 2 (assigned to new branch/department)`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
